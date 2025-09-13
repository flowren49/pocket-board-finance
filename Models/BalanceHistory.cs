using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PersonalFinanceApp.Models
{
    public class BalanceHistory
    {
        public int Id { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Balance { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal PreviousBalance { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Difference { get; set; }
        
        [StringLength(500)]
        public string? Notes { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Foreign key
        [Required]
        public int AccountId { get; set; }
        
        // Navigation properties
        public virtual Account Account { get; set; } = null!;
    }
}