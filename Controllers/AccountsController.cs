using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PersonalFinanceApp.Models.DTOs;
using PersonalFinanceApp.Services;
using System.Security.Claims;

namespace PersonalFinanceApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AccountsController : ControllerBase
    {
        private readonly IAccountService _accountService;
        private readonly INotificationService _notificationService;
        private readonly ILogger<AccountsController> _logger;

        public AccountsController(
            IAccountService accountService,
            INotificationService notificationService,
            ILogger<AccountsController> logger)
        {
            _accountService = accountService;
            _notificationService = notificationService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AccountDto>>> GetAccounts()
        {
            try
            {
                var userId = GetCurrentUserId();
                var accounts = await _accountService.GetUserAccountsAsync(userId);
                return Ok(accounts);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la récupération des comptes pour l'utilisateur {UserId}", GetCurrentUserId());
                return StatusCode(500, new { message = "Une erreur interne s'est produite." });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AccountDto>> GetAccount(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var account = await _accountService.GetAccountByIdAsync(id, userId);

                if (account == null)
                    return NotFound(new { message = "Compte non trouvé." });

                return Ok(account);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la récupération du compte {AccountId} pour l'utilisateur {UserId}", id, GetCurrentUserId());
                return StatusCode(500, new { message = "Une erreur interne s'est produite." });
            }
        }

        [HttpPost]
        public async Task<ActionResult<AccountDto>> CreateAccount([FromBody] CreateAccountDto createAccountDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var userId = GetCurrentUserId();
                var account = await _accountService.CreateAccountAsync(createAccountDto, userId);

                // Send notification
                await _notificationService.SendAccountCreatedNotificationAsync(userId, account.Name);

                return CreatedAtAction(nameof(GetAccount), new { id = account.Id }, account);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la création du compte pour l'utilisateur {UserId}", GetCurrentUserId());
                return StatusCode(500, new { message = "Une erreur interne s'est produite." });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<AccountDto>> UpdateAccount(int id, [FromBody] UpdateAccountDto updateAccountDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var userId = GetCurrentUserId();
                var account = await _accountService.UpdateAccountAsync(id, updateAccountDto, userId);

                return Ok(account);
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la mise à jour du compte {AccountId} pour l'utilisateur {UserId}", id, GetCurrentUserId());
                return StatusCode(500, new { message = "Une erreur interne s'est produite." });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAccount(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var account = await _accountService.GetAccountByIdAsync(id, userId);

                if (account == null)
                    return NotFound(new { message = "Compte non trouvé." });

                var success = await _accountService.DeleteAccountAsync(id, userId);

                if (!success)
                    return NotFound(new { message = "Compte non trouvé." });

                // Send notification
                await _notificationService.SendAccountDeletedNotificationAsync(userId, account.Name);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la suppression du compte {AccountId} pour l'utilisateur {UserId}", id, GetCurrentUserId());
                return StatusCode(500, new { message = "Une erreur interne s'est produite." });
            }
        }

        [HttpPost("{id}/balance")]
        public async Task<ActionResult<AccountDto>> UpdateBalance(int id, [FromBody] UpdateBalanceDto updateBalanceDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var userId = GetCurrentUserId();
                var account = await _accountService.GetAccountByIdAsync(id, userId);

                if (account == null)
                    return NotFound(new { message = "Compte non trouvé." });

                var previousBalance = account.CurrentBalance;
                var updatedAccount = await _accountService.UpdateBalanceAsync(id, updateBalanceDto, userId);

                // Send notification
                await _notificationService.SendBalanceUpdateNotificationAsync(
                    userId, 
                    updatedAccount.Name, 
                    updatedAccount.CurrentBalance, 
                    previousBalance);

                return Ok(updatedAccount);
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la mise à jour du solde du compte {AccountId} pour l'utilisateur {UserId}", id, GetCurrentUserId());
                return StatusCode(500, new { message = "Une erreur interne s'est produite." });
            }
        }

        [HttpGet("{id}/balance-history")]
        public async Task<ActionResult<IEnumerable<BalanceHistoryDto>>> GetBalanceHistory(int id, [FromQuery] int page = 1, [FromQuery] int pageSize = 50)
        {
            try
            {
                var userId = GetCurrentUserId();
                var account = await _accountService.GetAccountByIdAsync(id, userId);

                if (account == null)
                    return NotFound(new { message = "Compte non trouvé." });

                var balanceHistory = await _accountService.GetAccountBalanceHistoryAsync(id, userId, page, pageSize);

                return Ok(balanceHistory);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la récupération de l'historique du compte {AccountId} pour l'utilisateur {UserId}", id, GetCurrentUserId());
                return StatusCode(500, new { message = "Une erreur interne s'est produite." });
            }
        }

        [HttpGet("statistics")]
        public async Task<ActionResult<object>> GetStatistics()
        {
            try
            {
                var userId = GetCurrentUserId();
                var totalBalance = await _accountService.GetTotalBalanceAsync(userId);
                var totalInitialBalance = await _accountService.GetTotalInitialBalanceAsync(userId);
                var totalGainLoss = totalBalance - totalInitialBalance;

                var accounts = await _accountService.GetUserAccountsAsync(userId);
                var accountBalances = accounts.Select(a => new AccountBalanceDto
                {
                    AccountId = a.Id,
                    AccountName = a.Name,
                    AccountType = a.TypeName,
                    CurrentBalance = a.CurrentBalance,
                    InitialBalance = a.InitialBalance,
                    Difference = a.CurrentBalance - a.InitialBalance,
                    PercentageChange = a.InitialBalance != 0 ? ((a.CurrentBalance - a.InitialBalance) / a.InitialBalance) * 100 : 0
                }).ToList();

                return Ok(new
                {
                    TotalBalance = totalBalance,
                    TotalInitialBalance = totalInitialBalance,
                    TotalGainLoss = totalGainLoss,
                    TotalGainLossPercentage = totalInitialBalance != 0 ? (totalGainLoss / totalInitialBalance) * 100 : 0,
                    TotalAccounts = accounts.Count(),
                    ActiveAccounts = accounts.Count(a => a.IsActive),
                    AccountBalances = accountBalances
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la récupération des statistiques pour l'utilisateur {UserId}", GetCurrentUserId());
                return StatusCode(500, new { message = "Une erreur interne s'est produite." });
            }
        }

        private string GetCurrentUserId()
        {
            return User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
        }
    }
}