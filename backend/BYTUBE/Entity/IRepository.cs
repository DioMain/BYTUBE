namespace BYTUBE.Entity
{
    public interface IRepository<T>
    {
        public T? Get(Guid guid);
        public List<T> GetAll();

        public void Create(T value);
        public void Update(T value);

        public void Delete(Guid guid);
    }
}
