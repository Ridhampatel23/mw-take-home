namespace backend.services;

using backend.data;
using backend.Mappers;
using backend.models;
using Microsoft.EntityFrameworkCore;

public class ProgramsService 
{
  private readonly AppDbContext _db;
  public ProgramsService(AppDbContext db) => _db = db;

  public async Task<IEnumerable<ProgramResponse>> GetAllPrograms()
    => await _db.Programs.AsNoTracking()
          .Select(p => ProgramsMapper.ToResponse(p))
          .ToListAsync();

  public async Task<ProgramResponse?> GetProgramById(Guid id)
  {
    var e = await _db.Programs.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);
    return e is null ? null : ProgramsMapper.ToResponse(e);
  }

  public async Task<ProgramResponse> CreateProgram(CreateProgramRequest req)
  {
    var e = ProgramsMapper.ToEntity(req);
    _db.Programs.Add(e);
    await _db.SaveChangesAsync();
    return ProgramsMapper.ToResponse(e);
  }

  public async Task<ProgramResponse?> UpdateProgramById(Guid id, UpdateProgramRequest req)
  {
    var e = await _db.Programs.FirstOrDefaultAsync(p => p.Id == id);
    if (e is null) return null;
    ProgramsMapper.ApplyUpdate(e, req);
    await _db.SaveChangesAsync(); 
    return ProgramsMapper.ToResponse(e);
  }

  public async Task<bool> DeleteProgramById(Guid id)
  {
    var e = await _db.Programs.FirstOrDefaultAsync(p => p.Id == id);
    if (e is null) return false;
    _db.Programs.Remove(e);
    await _db.SaveChangesAsync();
    return true;
  }

  public async Task<AssignResultResponse> AssignPeopleAsync(Guid programId, AssignPeopleRequest req)
  {
    var resultAssigned = new List<Guid>();
    var resultDupes = new List<Guid>();

    // Ensure program exists
    var programExists = await _db.Programs.AnyAsync(p => p.Id == programId);
    if (!programExists) throw new KeyNotFoundException("Program not found");

    // Existing pairs (avoid duplicates)
    var existing = await _db.ProgramAssignments
        .Where(pa => pa.ProgramId == programId && req.PersonIds.Contains(pa.PersonId))
        .Select(pa => pa.PersonId)
        .ToListAsync();

    foreach (var pid in req.PersonIds.Distinct())
    {
      if (existing.Contains(pid)) { resultDupes.Add(pid); continue; }
      _db.ProgramAssignments.Add(new ProgramAssignment { ProgramId = programId, PersonId = pid });
      resultAssigned.Add(pid);
    }

    await _db.SaveChangesAsync();
    return new AssignResultResponse(programId, resultAssigned, resultDupes);
  }

  public async Task<bool> RemovePersonFromProgram(Guid programId, Guid personId)
  {
    var pa = await _db.ProgramAssignments.FirstOrDefaultAsync(x => x.ProgramId == programId && x.PersonId == personId);
    if (pa is null) return false;
    _db.ProgramAssignments.Remove(pa);
    await _db.SaveChangesAsync();
    return true;
  }

  public async Task<List<Guid>> GetAssignedPeopleIds(Guid programId)
  {
    return await _db.ProgramAssignments.Where(pa => pa.ProgramId == programId)
      .Select(pa => pa.PersonId)
      .ToListAsync();
  }
}