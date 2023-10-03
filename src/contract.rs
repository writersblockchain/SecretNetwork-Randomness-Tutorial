use cosmwasm_std::{
    entry_point, to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdError, StdResult,
};

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, FlipResponse, InstantiateMsg, QueryMsg};
use crate::state::{SecretCoin, COIN};

#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    _msg: InstantiateMsg,
) -> Result<Response, StdError> {
    deps.api
        .debug(&format!("Contract was initialized by {}", info.sender));

    Ok(Response::default())
}

#[entry_point]
pub fn execute(
    deps: DepsMut,
    env: Env,
    _info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::Flip {} => try_flip(deps, env),
    }
}

pub fn try_flip(deps: DepsMut, env: Env) -> Result<Response, ContractError> {
    let coin_flip = env.block.random.unwrap().0[0] % 2;

    let heads = SecretCoin {
        heads: true,
        tails: false,
    };

    let tails = SecretCoin {
        heads: false,
        tails: true,
    };

    if coin_flip == 0 {
        COIN.insert(deps.storage, &true, &heads)?;
    } else if coin_flip == 1 {
        COIN.insert(deps.storage, &true, &tails)?;
    }

    deps.api.debug("flipped!");
    Ok(Response::default())
}

#[entry_point]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetFlip {} => to_binary(&query_flip(deps)?),
    }
}

fn query_flip(deps: Deps) -> StdResult<FlipResponse> {
    let coin_flip = COIN.get(deps.storage, &true);

    match coin_flip {
        Some(secret_coin) => Ok(FlipResponse {
            secret_coin: secret_coin,
        }),
        None => Err(StdError::generic_err("Coin doesn't exist")),
    }
}
