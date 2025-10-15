using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace backend.data;
using backend.models;

public class AppDbContext : DbContext
{
    public DbSet<People> People => Set<People>();
    public DbSet<Programs> Programs => Set<Programs>();
    public DbSet<ProgramAssignment> ProgramAssignments => Set<ProgramAssignment>();

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<People>().HasIndex(p => p.Email).IsUnique();
        b.Entity<ProgramAssignment>().HasKey(pa => new { pa.ProgramId, pa.PersonId });
        b.Entity<ProgramAssignment>().HasOne(pa => pa.Program)
            .WithMany(p => p.ProgramAssignments).HasForeignKey(pa => pa.ProgramId);
        b.Entity<ProgramAssignment>().HasOne(pa => pa.people)
            .WithMany(p => p.ProgramAssignments).HasForeignKey(pa => pa.PersonId);
    }
}