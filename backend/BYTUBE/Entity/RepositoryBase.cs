
using System.Threading.Tasks;

namespace BYTUBE.Entity
{
    public abstract class RepositoryBase<T> : IRepository<T>
    {
        protected PostgresDbContext Context;

        public RepositoryBase(PostgresDbContext context)
        {
            Context = context;
        }

        public abstract void Create(T value);
        public abstract void Delete(Guid guid);
        public abstract T? Get(Guid guid);
        public abstract List<T> GetAll();
        public abstract void Update(T value);

        public async Task SaveChanged()
        {
            await Context.SaveChangesAsync();
        }
    }
}
