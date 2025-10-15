namespace backend.models;

public class ProgramAssignment {
    public Guid ProgramId { get; set; }
    public Programs Program { get; set; } = default!;
    public Guid PersonId { get; set; }
    public People people { get; set; } = default!;
    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
}