namespace BYTUBE.Entity
{
    public interface IRepository<T> where T : class
    {
        public T? Get(Guid guid);

        public void Create(T value);
        public void Update(T value);

        public void Delete(Guid guid);
    }
}
