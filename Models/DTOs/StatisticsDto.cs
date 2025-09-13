namespace PersonalFinanceApp.Models.DTOs
{
    public class StatisticsDto
    {
        public decimal TotalBalance { get; set; }
        public decimal TotalInitialBalance { get; set; }
        public decimal TotalGainLoss { get; set; }
        public int TotalAccounts { get; set; }
        public int ActiveAccounts { get; set; }
        public List<AccountBalanceDto> AccountBalances { get; set; } = new List<AccountBalanceDto>();
        public List<BalanceEvolutionDto> BalanceEvolution { get; set; } = new List<BalanceEvolutionDto>();
    }
    
    public class AccountBalanceDto
    {
        public int AccountId { get; set; }
        public string AccountName { get; set; } = string.Empty;
        public string AccountType { get; set; } = string.Empty;
        public decimal CurrentBalance { get; set; }
        public decimal InitialBalance { get; set; }
        public decimal Difference { get; set; }
        public decimal PercentageChange { get; set; }
    }
    
    public class BalanceEvolutionDto
    {
        public DateTime Date { get; set; }
        public decimal TotalBalance { get; set; }
        public List<AccountEvolutionDto> AccountEvolution { get; set; } = new List<AccountEvolutionDto>();
    }
    
    public class AccountEvolutionDto
    {
        public int AccountId { get; set; }
        public string AccountName { get; set; } = string.Empty;
        public decimal Balance { get; set; }
    }
    
    public class ExportRequestDto
    {
        [Required]
        public ExportFormat Format { get; set; }
        
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public List<int>? AccountIds { get; set; }
        public bool IncludeBalanceHistory { get; set; } = true;
    }
    
    public enum ExportFormat
    {
        Excel = 0,
        Csv = 1
    }
}