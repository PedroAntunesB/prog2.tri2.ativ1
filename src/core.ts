import { Database } from "bun:sqlite";

const db = new Database("database.sqlite");

db.run(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    title TEXT NOT NULL
  )
`);

const querySelectItems = db.prepare("SELECT * FROM items");
const queryInsertItem = db.prepare("INSERT INTO items (title) VALUES (?)");
const queryDeleteItem = db.prepare("DELETE FROM items WHERE id = (?);");
const queryUpdateItem = db.prepare("UPDATE items SET title = (?) WHERE id = (?)");

class Item {
  constructor(public title: string) { }
}


class TodoList {
  private items: Item[] = []

  addItem(item: Item) {
    this.items.push(item);
    queryInsertItem.run(item.title);
  }

  removeItem(id: number) {
    this.items.splice(id, 2)
    queryDeleteItem.run(id + 1);
  }

  getItems() {
    const items = querySelectItems.all();
    return items;
  }

  updateItems(newTitle: string, id: number) {
    queryUpdateItem.run(newTitle, id + 1);
  }
}

const lista = new TodoList()
lista.addItem(new Item("ficar quieto"));
lista.addItem(new Item("prestar atenção"));
lista.addItem(new Item("aprender typescript"));
lista.removeItem(0);
lista.updateItems("beijar o clayton", 2);
console.table(lista.getItems());