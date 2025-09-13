using PersonalFinanceApp.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace PersonalFinanceApp.Services
{
    public class NotificationService : INotificationService
    {
        private readonly IHubContext<BalanceHub> _hubContext;

        public NotificationService(IHubContext<BalanceHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task SendBalanceUpdateNotificationAsync(string userId, string accountName, decimal newBalance, decimal previousBalance)
        {
            var message = $"Solde mis à jour pour {accountName}: {previousBalance:C} → {newBalance:C}";
            var difference = newBalance - previousBalance;
            var isIncrease = difference > 0;

            await _hubContext.Clients.User(userId).SendAsync("BalanceUpdated", new
            {
                AccountName = accountName,
                NewBalance = newBalance,
                PreviousBalance = previousBalance,
                Difference = difference,
                IsIncrease = isIncrease,
                Message = message,
                Timestamp = DateTime.UtcNow
            });
        }

        public async Task SendAccountCreatedNotificationAsync(string userId, string accountName)
        {
            var message = $"Nouveau compte créé: {accountName}";

            await _hubContext.Clients.User(userId).SendAsync("AccountCreated", new
            {
                AccountName = accountName,
                Message = message,
                Timestamp = DateTime.UtcNow
            });
        }

        public async Task SendAccountDeletedNotificationAsync(string userId, string accountName)
        {
            var message = $"Compte supprimé: {accountName}";

            await _hubContext.Clients.User(userId).SendAsync("AccountDeleted", new
            {
                AccountName = accountName,
                Message = message,
                Timestamp = DateTime.UtcNow
            });
        }

        public async Task SendLowBalanceAlertAsync(string userId, string accountName, decimal currentBalance, decimal threshold)
        {
            var message = $"Alerte: Solde faible pour {accountName}. Solde actuel: {currentBalance:C} (Seuil: {threshold:C})";

            await _hubContext.Clients.User(userId).SendAsync("LowBalanceAlert", new
            {
                AccountName = accountName,
                CurrentBalance = currentBalance,
                Threshold = threshold,
                Message = message,
                Timestamp = DateTime.UtcNow
            });
        }
    }
}