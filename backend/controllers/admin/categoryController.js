const fs = require('fs');
const path = require('path');
const {
  listCategories,
  createCategory,
  findCategoryById,
  findCategoryBySlug,
  updateCategoryById,
  deleteCategoryById,
  listCategoriesForSelection,
} = require('../../models/categoryModel');

const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'categories');

function imageUrl(image) {
  return image ? `/uploads/categories/${image}` : null;
}

function serializeCategory(row) {
  return {
    ...row,
    isActive: !!row.is_active,
    image_url: imageUrl(row.image),
  };
}

async function index(_req, res) {
  try {
    const items = await listCategories();
    return res.json({ success: true, items: items.map(serializeCategory) });
  } catch (error) {
    console.error('Failed to list categories:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch categories.' });
  }
}

async function show(req, res) {
  try {
    const item = await findCategoryById(req.params.id);
    if (!item) return res.status(404).json({ success: false, error: 'Category not found.' });
    return res.json({ success: true, item: serializeCategory(item) });
  } catch (error) {
    console.error('Failed to show category:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch category.' });
  }
}

async function store(req, res) {
  const { name, slug } = req.body;

  if (!String(name || '').trim()) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(400).json({ success: false, error: 'Name is required.' });
  }

  let finalSlug = String(slug || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  if (!finalSlug) {
    finalSlug = String(name).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  if (!finalSlug) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(400).json({ success: false, error: 'Slug could not be auto-generated. Please check category name.' });
  }

  if (!req.file) {
    return res.status(400).json({ success: false, error: 'Image is required.' });
  }

  try {
    const existingSlug = await findCategoryBySlug(finalSlug);
    if (existingSlug) {
      if (req.file) fs.unlink(req.file.path, () => {});
      return res.status(400).json({ success: false, error: `Slug "${finalSlug}" is already in use.` });
    }

    const id = await createCategory({
      name: name.trim(),
      slug: finalSlug,
      image: req.file.filename,
    });

    const item = await findCategoryById(id);
    return res.status(201).json({ success: true, message: 'Category added successfully.', item: serializeCategory(item) });
  } catch (error) {
    if (req.file) fs.unlink(req.file.path, () => {});
    console.error('Failed to create category:', error);
    return res.status(500).json({ success: false, error: 'Failed to add category.' });
  }
}

async function update(req, res) {
  const existing = await findCategoryById(req.params.id);
  if (!existing) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(404).json({ success: false, error: 'Category not found.' });
  }

  const { name, slug, is_active } = req.body;

  if (!String(name || '').trim()) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(400).json({ success: false, error: 'Name is required.' });
  }

  let finalSlug = String(slug || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  if (!finalSlug) {
    finalSlug = String(name).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  if (!finalSlug) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(400).json({ success: false, error: 'Valid slug is required.' });
  }

  const finalIsActive = is_active !== undefined ? (is_active === 'true' || is_active === '1' || is_active === true) ? 1 : 0 : existing.is_active;

  try {
    const existingSlug = await findCategoryBySlug(finalSlug);
    if (existingSlug && Number(existingSlug.id) !== Number(req.params.id)) {
      if (req.file) fs.unlink(req.file.path, () => {});
      return res.status(400).json({ success: false, error: `Slug "${finalSlug}" is already in use by another category.` });
    }

    const updatedImage = req.file ? req.file.filename : existing.image;
    await updateCategoryById(req.params.id, {
      name: name.trim(),
      slug: finalSlug,
      image: updatedImage,
      is_active: finalIsActive,
    });

    if (req.file && existing.image && existing.image !== req.file.filename) {
      fs.unlink(path.join(uploadDir, existing.image), () => {});
    }

    const item = await findCategoryById(req.params.id);
    return res.json({ success: true, message: 'Category updated successfully.', item: serializeCategory(item) });
  } catch (error) {
    if (req.file) fs.unlink(req.file.path, () => {});
    console.error('Failed to update category:', error);
    return res.status(500).json({ success: false, error: 'Failed to update category.' });
  }
}

async function destroy(req, res) {
  try {
    const existing = await findCategoryById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, error: 'Category not found.' });

    await deleteCategoryById(req.params.id);
    if (existing.image) {
      fs.unlink(path.join(uploadDir, existing.image), () => {});
    }
    return res.json({ success: true, message: 'Category deleted successfully.' });
  } catch (error) {
    console.error('Failed to delete category:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete category.' });
  }
}

async function toggleStatus(req, res) {
  try {
    const existing = await findCategoryById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, error: 'Category not found.' });

    const nextStatus = existing.is_active ? 0 : 1;
    await updateCategoryById(req.params.id, {
      name: existing.name,
      slug: existing.slug,
      image: existing.image,
      is_active: nextStatus,
    });

    return res.json({ success: true, message: 'Status updated successfully.', is_active: nextStatus, isActive: !!nextStatus });
  } catch (error) {
    console.error('Failed to toggle category status:', error);
    return res.status(500).json({ success: false, error: 'Failed to update status.' });
  }
}

async function listCategoryOptions(_req, res) {
  try {
    const categories = await listCategoriesForSelection();
    return res.json({ success: true, categories });
  } catch (error) {
    console.error('Failed to list category options:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch categories.' });
  }
}

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
  toggleStatus,
  listCategoryOptions,
};
