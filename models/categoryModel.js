const pool = require('./database');

const categoryModel = {
    getAll: async () => {
        try {
            const query = 'SELECT * FROM category c ORDER BY (id) ASC LIMIT 0,4';
            const [categories] = await pool.query(query);
            return categories;
        } catch (error) {
            console.error('Error in categoryModel.getAll: ', error);
            throw error;
        }
    },
    getOne: async (categoryId) => {
        try {
            const query = 'SELECT * FROM category c WHERE c.id = ' + categoryId;
            const [categoryData] = await pool.query(query);
            return categoryData;
        } catch (error) {
            console.error('Error in categoryModel.getAll: ', error);
            throw error;
        }
    },
    delete: async (categoryId) => {
        try {
            const query = 'DELETE FROM category c WHERE c.id = ' + categoryId;
            await pool.query(query);
        } catch (error) {
            console.error('Error in categoryModel.getAll: ', error);
            throw error;
        }
    },
    create: async (data) => {
        try {
            var is_active = data.enable === "true" ? 1 : 0;
            const query = `
            INSERT INTO category 
            (name, description, slug, image_path, is_active, meta_title, meta_description, meta_keywords) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
            const values = [
                data.name, data.description, data.slug, data.image,
                is_active, data.metaTitle, data.metaDescription, data.metaKeywords
            ];
            const [result] = await pool.query(query, values);
            const newCategoryId = result.insertId;
            const [categories] = await pool.query('SELECT * FROM category WHERE id = ?', [newCategoryId]);
            const newCategory = categories[0];
            newCategory.is_active = newCategory.is_active === 1;
            return newCategory;
        } catch (error) {
            console.error('Error in categoryModel.create: ', error);
            throw error;
        }
    },
    update: async (data) => {
        try {
            if (!data.id) {
                throw new Error('Invalid category id');
            }
            var is_active = data.enable === "true" ? 1 : 0;
            const query = `UPDATE category SET name = ?, slug = ?, description = ?, image_path = ?, is_active = ?, meta_title = ?, meta_description = ?, meta_keywords = ? WHERE id = ?;`;
            const values = [
                data.name,
                data.slug,
                data.description,
                data.image,
                is_active,
                data.metaTitle,
                data.metaDescription,
                data.metaKeywords,
                data.id
            ];
            const [result] = await pool.query(query, values);
            const [categories] = await pool.query('SELECT * FROM category WHERE id = ?', [data.id]);
            const newCategory = categories[0];
            newCategory.is_active = newCategory.is_active === 1;
            return newCategory;
        } catch (error) {
            console.error('Error in categoryModel.update: ', error);
            throw error;
        }
    }
};

module.exports = categoryModel;