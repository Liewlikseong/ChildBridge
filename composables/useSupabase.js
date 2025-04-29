import { useSupabaseClient } from '#imports';

export const useSupabase = () => {
  const supabase = useSupabaseClient();

  const fetchData = async (table, query = {}) => {
    try {
      let queryBuilder = supabase.from(table).select();

      if (query.filters) {
        query.filters.forEach(filter => {
          queryBuilder = queryBuilder.filter(filter.column, filter.operator, filter.value);
        });
      }

      if (query.order) {
        queryBuilder = queryBuilder.order(query.order.column, { ascending: query.order.ascending });
      }

      if (query.limit) {
        queryBuilder = queryBuilder.limit(query.limit);
      }

      const { data, error } = await queryBuilder;

      if (error) throw error;
      return { data };
    } catch (error) {
      console.error(`Error fetching data from ${table}:`, error);
      return { error: error.message };
    }
  };

  const insertData = async (table, data) => {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select();

      if (error) throw error;
      return { data: result };
    } catch (error) {
      console.error(`Error inserting data into ${table}:`, error);
      return { error: error.message };
    }
  };

  const updateData = async (table, id, data) => {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select();

      if (error) throw error;
      return { data: result };
    } catch (error) {
      console.error(`Error updating data in ${table}:`, error);
      return { error: error.message };
    }
  };

  const deleteData = async (table, id) => {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error(`Error deleting data from ${table}:`, error);
      return { error: error.message };
    }
  };

  return {
    fetchData,
    insertData,
    updateData,
    deleteData
  };
};