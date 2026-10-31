use chrono::Utc;
use clap::{Parser, Subcommand};
use std::fs;
use std::path::PathBuf;
use touchstone_anchor::ForwardOnlyHub;
use touchstone_chain::GENESIS_DIGEST;
use touchstone_integrity::Session;
use touchstone_ledger::{Binding, Evidence, Event, EventType, Ledger};

#[derive(Parser)]
#[command(name = "touchstone", about = "Touchstone foundational tools (Rust)")]
struct Cli {
    #[command(subcommand)]
    cmd: Cmd,
}

#[derive(Subcommand)]
enum Cmd {
    /// Append a pending decision to a named log
    Decide {
        claim: String,
        #[arg(long)]
        log: String,
        #[arg(long)]
        id: Option<String>,
        #[arg(long)]
        offline_ref: Option<String>,
        #[arg(long, default_value = "data/ops-ledger.jsonl")]
        path: PathBuf,
    },
    /// Verify a decision with a reproducible-check binding
    Verify {
        #[arg(long)]
        log: String,
        #[arg(long)]
        target: String,
        #[arg(long)]
        command: String,
        #[arg(long)]
        repo: String,
        #[arg(long)]
        commit: String,
        #[arg(long, default_value = "data/ops-ledger.jsonl")]
        path: PathBuf,
    },
    /// Project tessera summary for a log
    Tessera {
        #[arg(long)]
        log: String,
        #[arg(long, default_value = "data/ops-ledger.jsonl")]
        path: PathBuf,
    },
    /// Scan text at the desk integrity boundary
    Scan {
        text: String,
    },
    /// Anchor the current log head in the forward-only hub (Checkmate contract)
    Anchor {
        #[arg(long)]
        log: String,
        #[arg(long, default_value = "data/ops-ledger.jsonl")]
        path: PathBuf,
        #[arg(long, default_value = "data/anchors.json")]
        hub: PathBuf,
    },
}

fn load_ledger(path: &PathBuf, log: &str) -> Result<Ledger, String> {
    let mut ledger = Ledger::open(log).map_err(|e| e.to_string())?;
    if path.exists() {
        let raw = fs::read_to_string(path).map_err(|e| e.to_string())?;
        for line in raw.lines().filter(|l| !l.trim().is_empty()) {
            let recorded: touchstone_ledger::Recorded =
                serde_json::from_str(line).map_err(|e| e.to_string())?;
            // Re-append via raw push path: trust file but re-verify chain at end
            // Use internal reconstruct by appending events in order
            ledger
                .append(recorded.event)
                .map_err(|e| e.to_string())?;
        }
        ledger.verify_chain().map_err(|e| e.to_string())?;
    }
    Ok(ledger)
}

fn save_ledger(path: &PathBuf, ledger: &Ledger) -> Result<(), String> {
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    fs::write(path, ledger.export_jsonl().map_err(|e| e.to_string())?)
        .map_err(|e| e.to_string())
}

fn main() {
    let cli = Cli::parse();
    match run(cli) {
        Ok(()) => {}
        Err(e) => {
            eprintln!("error: {e}");
            std::process::exit(2);
        }
    }
}

fn run(cli: Cli) -> Result<(), String> {
    match cli.cmd {
        Cmd::Decide {
            claim,
            log,
            id,
            offline_ref,
            path,
        } => {
            let mut ledger = load_ledger(&path, &log)?;
            let id = id.unwrap_or_else(|| format!("d-{}", ledger.records().len() + 1));
            let head_prefix = {
                let rec = ledger
                    .append(Event {
                        id: id.clone(),
                        event_type: EventType::Decision,
                        claim,
                        targets: vec![],
                        evidence: vec![],
                        timestamp: Utc::now(),
                        agent_id: "touchstone-cli".into(),
                        offline_reference: offline_ref,
                    })
                    .map_err(|e| e.to_string())?;
                rec.chain_hash[..12].to_string()
            };
            save_ledger(&path, &ledger)?;
            println!("{id} · pending_evidence · head {head_prefix}");
        }
        Cmd::Verify {
            log,
            target,
            command,
            repo,
            commit,
            path,
        } => {
            let mut ledger = load_ledger(&path, &log)?;
            let id = format!("v-{}", ledger.records().len() + 1);
            ledger
                .append(Event {
                    id,
                    event_type: EventType::Verification,
                    claim: format!("Verified {target}"),
                    targets: vec![target.clone()],
                    evidence: vec![Evidence {
                        kind: "reproducible_check".into(),
                        reference: command.clone(),
                        checked_at: None,
                        binding: Some(Binding::ReproducibleCheck {
                            command,
                            repo,
                            commit,
                            expect_exit: 0,
                        }),
                    }],
                    timestamp: Utc::now(),
                    agent_id: "touchstone-cli".into(),
                    offline_reference: None,
                })
                .map_err(|e| e.to_string())?;
            save_ledger(&path, &ledger)?;
            println!("{target} · validated · head {}", &ledger.head()[..12]);
        }
        Cmd::Tessera { log, path } => {
            let ledger = load_ledger(&path, &log)?;
            let t = ledger.tessera();
            println!(
                "{} decisions · {} verified · {} pending · {} foreclosed · epoch {} · head {}",
                t.decisions,
                t.validated,
                t.pending,
                t.foreclosed,
                t.epoch,
                &t.head[..12]
            );
        }
        Cmd::Scan { text } => {
            let mut session = Session::new(format!("scan-{}", Utc::now().timestamp()));
            match session.scan_desk_text(&text) {
                Ok(_) => println!("clear · state {}", session.state.label()),
                Err(e) => {
                    println!("refused · state {} · {e}", session.state.label());
                    std::process::exit(2);
                }
            }
        }
        Cmd::Anchor { log, path, hub } => {
            let ledger = load_ledger(&path, &log)?;
            let height = ledger.records().len();
            let head = ledger.head();

            let mut store = ForwardOnlyHub::new();
            if hub.exists() {
                let raw = fs::read_to_string(&hub).map_err(|e| e.to_string())?;
                let rows: Vec<touchstone_anchor::AnchorRecord> =
                    serde_json::from_str(&raw).map_err(|e| e.to_string())?;
                for r in rows {
                    store
                        .anchor(r.log, r.height, r.head, r.previous_head)
                        .map_err(|e| e.to_string())?;
                }
            }

            // Checkmate contract: first published head extends genesis; later
            // heads must strictly extend the last anchored head.
            let prev = store
                .latest(&log)
                .map(|r| r.head.clone())
                .unwrap_or_else(|| GENESIS_DIGEST.to_string());

            let (anchored_log, anchored_height, anchored_head) = {
                let rec = store
                    .anchor(&log, height, &head, &prev)
                    .map_err(|e| e.to_string())?;
                (rec.log.clone(), rec.height, rec.head[..12].to_string())
            };
            if let Some(parent) = hub.parent() {
                fs::create_dir_all(parent).map_err(|e| e.to_string())?;
            }
            let all: Vec<_> = store.history(&log).to_vec();
            fs::write(&hub, serde_json::to_string_pretty(&all).unwrap())
                .map_err(|e| e.to_string())?;
            println!("anchored {anchored_log} @ height {anchored_height} · head {anchored_head}");
        }
    }
    Ok(())
}
