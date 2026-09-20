using ECommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ECommerce.Infrastructure.Persistence.Configurations;

public class RoleMenuConfiguration : IEntityTypeConfiguration<ApplicationRoleMenu>
{
    public void Configure(EntityTypeBuilder<ApplicationRoleMenu> b)
    {
        b.ToTable("ApplicationRoleMenus");

        // ✅ composite PK
        b.HasKey(x => new { x.RoleId, x.MenuId });

        b.HasIndex(x => x.RoleId);
        b.HasIndex(x => x.MenuId);

        b.HasOne(x => x.Menu)
         .WithMany()
         .HasForeignKey(x => x.MenuId)
         .OnDelete(DeleteBehavior.Cascade);
    }
}
