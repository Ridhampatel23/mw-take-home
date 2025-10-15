namespace backend.models;

public class Programs
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public ICollection<ProgramAssignment> ProgramAssignments { get; set; } = new List<ProgramAssignment>();
}