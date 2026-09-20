using ECommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ECommerce.Infrastructure.Persistence.Configurations;

public class RoleMenuPermissionConfiguration : IEntityTypeConfiguration<RoleMenuPermission>
{
    public void Configure(EntityTypeBuilder<RoleMenuPermission> b)
    {
        b.ToTable("RoleMenuPermissions");

        // ✅ composite PK
        b.HasKey(x => new { x.RoleId, x.MenuId, x.PermissionId });

        // FK -> RoleMenu (composite FK)
        b.HasOne(x => x.RoleMenu)
         .WithMany(rm => rm.Permissions)
         .HasForeignKey(x => new { x.RoleId, x.MenuId })
         .OnDelete(DeleteBehavior.Cascade);

        // FK -> Permission
        b.HasOne(x => x.Permission)
         .WithMany()
         .HasForeignKey(x => x.PermissionId)
         .OnDelete(DeleteBehavior.Restrict);
    }
}
