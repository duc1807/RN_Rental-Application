const tableName = 'post'

export const createPostTable = async (db) => {
  console.log('CREATE POST TABLE')
  // create table if not exists
  const query = `CREATE TABLE IF NOT EXISTS ${tableName}(
        _id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        bedroom INTERGER NOT NULL,
        rentPrice INTERGER NOT NULL,
        furnitureType TEXT,
        notes TEXT,
        reporter TEXT NOT NULL
    );`

  db.transaction((tx) => {
    tx.executeSql(query, null)
  })
}

export const getPost = (db) => {
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

export const savePost = async (db, post) => {
  return new Promise((res, rej) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO ${tableName}(type, createdAt, bedroom, rentPrice, furnitureType, notes, reporter) values (?,?,?,?,?,?,?)`,
        [
          post.type,
          post.createdAt,
          post.bedroom,
          post.rentPrice,
          post.furnitureType,
          post.notes,
          post.reporter,
        ],
        (txObj, resultSet) => {
          res(resultSet)
        },
        (txObj, error) => {
          console.log('Error', error)
          rej(error)
        }
      )
    })
  })
}

export const getPostById = async (db, id) => {
  return new Promise((res, rej) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM ${tableName}
        WHERE _id = ${id}`,
        null,
        (txObj, { rows: { _array } }) => {
          res(_array?.[0] || null)
        },
        (txObj, error) => rej(error)
      )
    })
  })
}

export const updatePost = async (db, id, newPostData) => {
  const {
    type,
    bedroom,
    createdAt,
    rentPrice,
    furnitureType,
    notes,
    reporter,
  } = newPostData

  db.transaction((tx) => {
    tx.executeSql(
      `
      UPDATE ${tableName}
      SET
        type = '${type}',
        createdAt = '${createdAt}',
        bedroom = ${bedroom},
        rentPrice = ${rentPrice},
        furnitureType = '${furnitureType}',
        notes = '${notes}',
        reporter = '${reporter}'
      WHERE _id = ${id}`,
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

export const deletePost = async (db, id) => {
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

export const deletePostTable = async (db) => {
  return new Promise((res, rej) => {
    const query = `DROP TABLE ${tableName}`

    db.transaction((tx) => {
      tx.executeSql(query, [], (tx, result) => {
        console.log('Delete table: ', tableName)
        res(result)
      })
    }),
      (tx, error) => {
        console.log(error)
        rej(error)
      }
  })
}
