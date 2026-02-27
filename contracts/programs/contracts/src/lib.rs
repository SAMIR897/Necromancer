use anchor_lang::prelude::*;

declare_id!("AEB7tb9xevpvCqX85pyiUj9CKu6sxnuaaxtnhGo7J1Rm");

#[program]
pub mod contracts {
    use super::*;

    pub fn initialize_vault(
        ctx: Context<InitializeVault>,
        agent_pubkey: Pubkey,
        prompt_hash: String,
    ) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.owner = ctx.accounts.user.key();
        vault.agent_pubkey = agent_pubkey;
        vault.prompt_hash = prompt_hash;
        vault.bump = ctx.bumps.vault;
        Ok(())
    }

    pub fn cast_vote(ctx: Context<CastVote>, proposal_id: u64, vote: bool) -> Result<()> {
        let vault = &ctx.accounts.vault;
        let vote_record = &mut ctx.accounts.vote_record;

        require!(
            ctx.accounts.agent.key() == vault.agent_pubkey,
            ErrorCode::UnauthorizedAgent
        );

        vote_record.proposal_id = proposal_id;
        vote_record.vote = vote;
        vote_record.voter_vault = vault.key();
        vote_record.bump = ctx.bumps.vote_record;

        msg!("Agent {:?} voted {} on Proposal {}", ctx.accounts.agent.key(), vote, proposal_id);
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeVault<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + Vault::INIT_SPACE,
        seeds = [b"vault", user.key().as_ref()],
        bump
    )]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(proposal_id: u64)]
pub struct CastVote<'info> {
    #[account(
        seeds = [b"vault", vault.owner.as_ref()],
        bump = vault.bump
    )]
    pub vault: Account<'info, Vault>,
    #[account(
        init,
        payer = agent,
        space = 8 + VoteRecord::INIT_SPACE,
        seeds = [b"vote", vault.key().as_ref(), proposal_id.to_le_bytes().as_ref()],
        bump
    )]
    pub vote_record: Account<'info, VoteRecord>,
    #[account(mut)]
    pub agent: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Vault {
    pub owner: Pubkey,
    pub agent_pubkey: Pubkey,
    #[max_len(256)]
    pub prompt_hash: String, // E.g., a hash of their prompt, or even just a short 256 char prompt.
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct VoteRecord {
    pub proposal_id: u64,
    pub vote: bool,
    pub voter_vault: Pubkey,
    pub bump: u8,
}

#[error_code]
pub enum ErrorCode {
    #[msg("The provided agent signer does not match the vault's authorized agent.")]
    UnauthorizedAgent,
}
