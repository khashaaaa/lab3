export class InMemoryDB<T extends { id: string }> {
    private data: Map<string, T> = new Map();

    async findAll(): Promise<T[]> {
        return Array.from(this.data.values());
    }

    async findById(id: string): Promise<T | null> {
        return this.data.get(id) || null;
    }

    async create(item: T): Promise<T> {
        this.data.set(item.id, item);
        return item;
    }

    async update(id: string, item: T): Promise<T | null> {
        if (!this.data.has(id)) return null;
        this.data.set(id, { ...item, id });
        return this.data.get(id) || null;
    }

    async delete(id: string): Promise<boolean> {
        return this.data.delete(id);
    }

    async clear(): Promise<void> {
        this.data.clear();
    }

    async bulkInsert(items: T[]): Promise<void> {
        items.forEach(item => this.data.set(item.id, item));
    }
}