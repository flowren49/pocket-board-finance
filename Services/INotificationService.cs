namespace PersonalFinanceApp.Services
{
    public interface INotificationService
    {
        Task SendBalanceUpdateNotificationAsync(string userId, string accountName, decimal newBalance, decimal previousBalance);
        Task SendAccountCreatedNotificationAsync(string userId, string accountName);
        Task SendAccountDeletedNotificationAsync(string userId, string accountName);
        Task SendLowBalanceAlertAsync(string userId, string accountName, decimal currentBalance, decimal threshold);
    }
}