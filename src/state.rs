use schemars::JsonSchema;
use secret_toolkit_storage::Keymap;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]

pub struct SecretCoin {
    pub heads: bool,
    pub tails: bool,
}

pub static COIN: Keymap<bool, SecretCoin> = Keymap::new(b"coin");
