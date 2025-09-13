using System.ComponentModel.DataAnnotations;

namespace PersonalFinanceApp.Models
{
    public class Account
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string? Description { get; set; }
        
        [Required]
        public AccountType Type { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal CurrentBalance { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal InitialBalance { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true;
        
        // Foreign key
        [Required]
        public string UserId { get; set; } = string.Empty;
        
        // Navigation properties
        public virtual ApplicationUser User { get; set; } = null!;
        public virtual ICollection<BalanceHistory> BalanceHistories { get; set; } = new List<BalanceHistory>();
    }
    
    public enum AccountType
    {
        Checking = 0,
        Savings = 1,
        Credit = 2,
        Investment = 3,
        Cash = 4,
        Other = 5
    }
}