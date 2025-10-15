namespace backend.services;



using backend.data;
using backend.Mappers;
using backend.models;
using Microsoft.EntityFrameworkCore;

public class PeopleService
{
    private readonly AppDbContext _db;
    public PeopleService(AppDbContext db) => _db = db;

    public async Task<IEnumerable<PersonResponse>> GetAllPeople()
    {
        var peopleQuery = _db.People.AsNoTracking();
        peopleQuery = peopleQuery.OrderBy(p => p.CreatedAt);
        return await peopleQuery.Select(p => PersonMapper.ToResponse(p)).ToListAsync();
    }

    public async Task<PersonResponse?> GetPersonById(Guid id)
    {
        var e = await _db.People.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);
        return e is null ? null : PersonMapper.ToResponse(e);
    }

    public async Task<PersonResponse> CreatePerson(CreatePersonRequest req)
    {
        var e = PersonMapper.ToEntity(req);
        _db.People.Add(e);
        await _db.SaveChangesAsync();
        return PersonMapper.ToResponse(e);
    }

    public async Task<PersonResponse?> UodatePersonById(Guid id, UpdatePersonRequest req)
    {
        var e = await _db.People.FirstOrDefaultAsync(p => p.Id == id);
        if (e is null) return null;
        PersonMapper.ApplyUpdate(e, req);
        await _db.SaveChangesAsync();
        return PersonMapper.ToResponse(e);
    }

    public async Task<bool> DeletePersonById(Guid id)
    {
        var e = await _db.People.FirstOrDefaultAsync(p => p.Id == id);
        if (e is null) return false;
        _db.People.Remove(e);
        await _db.SaveChangesAsync();
        return true;
    }
}
