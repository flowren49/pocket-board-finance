using PersonalFinanceApp.Models;

namespace PersonalFinanceApp.Models.DTOs
{
    public class AccountDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public AccountType Type { get; set; }
        public decimal CurrentBalance { get; set; }
        public decimal InitialBalance { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool IsActive { get; set; }
        public string TypeName => Type.ToString();
    }
    
    public class CreateAccountDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string? Description { get; set; }
        
        [Required]
        public AccountType Type { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal InitialBalance { get; set; }
    }
    
    public class UpdateAccountDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string? Description { get; set; }
        
        [Required]
        public AccountType Type { get; set; }
    }
    
    public class UpdateBalanceDto
    {
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal NewBalance { get; set; }
        
        [StringLength(500)]
        public string? Notes { get; set; }
    }
}