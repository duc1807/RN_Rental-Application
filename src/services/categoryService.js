import {
  enablePromise,
  openDatabase,
  SQLiteDatabase,
} from 'react-native-sqlite-storage'

const tableName = 'category'

export const createCategoryTable = async (db) => {
  // create table if not exists
  const query = `CREATE TABLE IF NOT EXISTS ${tableName}(_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    );`

  db.transaction((tx) => {
    tx.executeSql(query, null)
  })
}

export const getCategory = (db) => {
  return new Promise((res, rej) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM ${tableName}`,
        null,
        (txObj, { rows: { _array } }) => {
          res(_array)
        },
        (txObj, error) => console.log('Error ', error)
      )
    })
  })
}

export const getCategoryByName = (db, categoryName) => {
  return new Promise((res, rej) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM ${tableName}
        WHERE name = '${categoryName}'`,
        null,
        (txObj, { rows: { _array } }) => {
          res(_array)
        },
        (txObj, error) => rej('Error get category name')
      )
    })
  })
}

export const saveCategory = async (db, category) => {
  db.transaction((tx) => {
    tx.executeSql(
      `INSERT INTO ${tableName}(name) values (?)`,
      [category.name],
      (txObj, resultSet) => {
        return resultSet
      },
      (txObj, error) => console.log('Error', error)
    )
  })
}

export const updateCategory = async (db, id, categoryName) => {
  db.transaction((tx) => {
    tx.executeSql(
      `UPDATE ${tableName} SET name = '${categoryName}'  WHERE _id = ${id}`,
      [],
      (txObj, resultSet) => {
        if (resultSet.rowsAffected > 0) {
          return
        }
      },
      (txObj, error) => console.log('Error', error)
    )
  })
}

export const deleteCategory = async (db, id) => {
  const deleteQuery = `DELETE from ${tableName} where _id = ${id}`
  db.transaction((tx) => {
    tx.executeSql(deleteQuery, [], (tx, result) => {
      return result
    })
  }),
    (tx, error) => {
      console.log(error)
    }
}

export const deleteCategoryTable = async (db) => {
  return new Promise((res, rej) => {
    const query = `DROP TABLE ${tableName}`

    db.transaction((tx) => {
      tx.executeSql(query, [], (tx, result) => {
        res(result)
      })
    }),
      (tx, error) => {
        console.log(error)
        rej(error)
      }
  })
}
