namespace PersonalFinanceApp.Models.DTOs
{
    public class BalanceHistoryDto
    {
        public int Id { get; set; }
        public decimal Balance { get; set; }
        public decimal PreviousBalance { get; set; }
        public decimal Difference { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public int AccountId { get; set; }
        public string AccountName { get; set; } = string.Empty;
    }
    
    public class CreateBalanceHistoryDto
    {
        [Required]
        public int AccountId { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal NewBalance { get; set; }
        
        [StringLength(500)]
        public string? Notes { get; set; }
    }
}