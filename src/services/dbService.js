import * as SQLite from 'expo-sqlite'

export const getDBConnection = async () => {
  return SQLite.openDatabase('app-data.db')
}
