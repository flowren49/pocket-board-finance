using PersonalFinanceApp.Models;
using PersonalFinanceApp.Models.DTOs;

namespace PersonalFinanceApp.Services
{
    public interface IAccountService
    {
        Task<IEnumerable<AccountDto>> GetUserAccountsAsync(string userId);
        Task<AccountDto?> GetAccountByIdAsync(int accountId, string userId);
        Task<AccountDto> CreateAccountAsync(CreateAccountDto createAccountDto, string userId);
        Task<AccountDto> UpdateAccountAsync(int accountId, UpdateAccountDto updateAccountDto, string userId);
        Task<bool> DeleteAccountAsync(int accountId, string userId);
        Task<AccountDto> UpdateBalanceAsync(int accountId, UpdateBalanceDto updateBalanceDto, string userId);
        Task<IEnumerable<BalanceHistoryDto>> GetAccountBalanceHistoryAsync(int accountId, string userId, int page = 1, int pageSize = 50);
        Task<decimal> GetTotalBalanceAsync(string userId);
        Task<decimal> GetTotalInitialBalanceAsync(string userId);
    }
}