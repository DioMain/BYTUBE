
using System.Threading.Tasks;

namespace BYTUBE.Entity
{
    public abstract class RepositoryBase<T> : IRepository<T>
        where T : class
    {
        protected readonly PostgresDbContext _context;

        public RepositoryBase(PostgresDbContext context)
        {
            _context = context;
        }

        public virtual void Create(T value)
        {
            if (value == null)
                return;

            _context.Add(value);
        }
        public virtual async Task CreateAsync(T value)
        {
            if (value == null)
                return;

            await _context.AddAsync(value);
        }

        public virtual void Delete(Guid guid)
        {
            var item = Get(guid);

            if (item == null)
                return;

            _context.Remove(item);
        }

        public virtual T? Get(Guid guid)
        {
            return _context.Find<T>(guid);
        }
        public virtual async Task<T?> GetAsync(Guid guid)
        {
            return await _context.FindAsync<T>(guid);
        }

        public virtual void Update(T value)
        {
            _context.Update(value);
        }

        public async Task SaveChanges()
        {
            await _context.SaveChangesAsync();
        }
    }
}
