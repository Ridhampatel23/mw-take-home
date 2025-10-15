namespace backend.models;

public enum Role
{
    Admin ,
    Member,
    Coach
}

public class People
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = "";
    public string LastName { get; set; } = "";
    public string Email { get; set; } = "";
    public Role Role { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<ProgramAssignment> ProgramAssignments { get; set; } = new List<ProgramAssignment>();
}