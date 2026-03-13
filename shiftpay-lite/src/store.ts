import { Shift } from './types';

export type ShiftStore = {
  list(): Promise<Shift[]>;
  upsert(shift: Shift): Promise<void>;
  remove(id: string): Promise<void>;
  clear(): Promise<void>;
};

export class InMemoryShiftStore implements ShiftStore {
  private map = new Map<string, Shift>();

  async list(): Promise<Shift[]> {
    return [...this.map.values()].sort(
      (a, b) => new Date(a.startISO).getTime() - new Date(b.startISO).getTime(),
    );
  }

  async upsert(shift: Shift): Promise<void> {
    this.map.set(shift.id, shift);
  }

  async remove(id: string): Promise<void> {
    this.map.delete(id);
  }

  async clear(): Promise<void> {
    this.map.clear();
  }
}

export class JsonFileShiftStore implements ShiftStore {
  constructor(private readonly filePath: string) {}

  private async readAll(): Promise<Shift[]> {
    const fs = await import('node:fs/promises');
    try {
      const raw = await fs.readFile(this.filePath, 'utf8');
      const data = JSON.parse(raw) as Shift[];
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  private async writeAll(items: Shift[]): Promise<void> {
    const fs = await import('node:fs/promises');
    await fs.writeFile(this.filePath, JSON.stringify(items, null, 2), 'utf8');
  }

  async list(): Promise<Shift[]> {
    const items = await this.readAll();
    return items.sort((a, b) => new Date(a.startISO).getTime() - new Date(b.startISO).getTime());
  }

  async upsert(shift: Shift): Promise<void> {
    const items = await this.readAll();
    const idx = items.findIndex((x) => x.id === shift.id);
    if (idx >= 0) items[idx] = shift;
    else items.push(shift);
    await this.writeAll(items);
  }

  async remove(id: string): Promise<void> {
    const items = await this.readAll();
    await this.writeAll(items.filter((x) => x.id !== id));
  }

  async clear(): Promise<void> {
    await this.writeAll([]);
  }
}
