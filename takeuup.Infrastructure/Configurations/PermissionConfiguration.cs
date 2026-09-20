using ECommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ECommerce.Infrastructure.Persistence.Configurations;

public class PermissionConfiguration : IEntityTypeConfiguration<Permission>
{
    public void Configure(EntityTypeBuilder<Permission> b)
    {
        b.ToTable("Permissions");
        b.HasKey(x => x.Id);

        b.Property(x => x.Name).HasMaxLength(100).IsRequired();
        b.HasIndex(x => x.Name).IsUnique();

        // ✅ seed (optional but very useful)
        b.HasData(
            new Permission { Id = 1, Name = "View" },
            new Permission { Id = 2, Name = "Create" },
            new Permission { Id = 3, Name = "Edit" },
            new Permission { Id = 4, Name = "Delete" }
        );
    }
}
