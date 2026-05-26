const {
  listEvents,
  findEventById,
  createEvent,
  updateEventById,
  deleteEventById,
} = require('../../models/eventModel');

const EVENT_STATUSES = ['upcoming', 'past'];

function slugifyLinkText(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeEventLink(rawValue) {
  if (!rawValue || !String(rawValue).trim()) return null;

  const value = String(rawValue).trim();

  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith('/')) return value;
  if (/^event\//i.test(value)) return `/${value}`;

  const slug = slugifyLinkText(value);
  return slug ? `/event/${slug}` : null;
}

function setFlash(req, type, message) {
  req.session.flash = { type, message };
}

async function index(req, res) {
  try {
    const events = await listEvents();
    return res.render('events/index', {
      user: req.session.user,
      events,
      message: res.locals.flashMessage,
      error: res.locals.flashError,
    });
  } catch (err) {
    console.error('Failed to load events:', err);
    return res.render('events/index', {
      user: req.session.user,
      events: [],
      message: null,
      error: 'Unable to load events right now.',
    });
  }
}

function add(req, res) {
  return res.render('events/add', {
    user: req.session.user,
    statuses: EVENT_STATUSES,
    error: null,
    formData: {},
    uploadedImagePaths: [],
  });
}

async function store(req, res) {
  const { title, location, start_date, end_date, description, event_url, status } = req.body;
  const uploadedImagePaths = (req.files || []).map((file) => file.filename);

  if (!title || !title.trim()) {
    return res.render('events/add', {
      user: req.session.user,
      statuses: EVENT_STATUSES,
      error: 'Event title is required.',
      formData: req.body,
      uploadedImagePaths,
    });
  }

  if (!EVENT_STATUSES.includes(status)) {
    return res.render('events/add', {
      user: req.session.user,
      statuses: EVENT_STATUSES,
      error: 'Invalid status selected.',
      formData: req.body,
      uploadedImagePaths,
    });
  }

  try {
    await createEvent({
      title: title.trim(),
      location: location && location.trim() ? location.trim() : null,
      start_date: start_date || null,
      end_date: end_date || null,
      description: description && description.trim() ? description.trim() : null,
      event_image: uploadedImagePaths,
      event_url: normalizeEventLink(event_url),
      status,
    });
    setFlash(req, 'success', 'Event created successfully.');
    return res.redirect('/events');
  } catch (err) {
    console.error('Failed to create event:', err);
    return res.render('events/add', {
      user: req.session.user,
      statuses: EVENT_STATUSES,
      error: 'Failed to create event. Please try again.',
      formData: req.body,
      uploadedImagePaths,
    });
  }
}

async function edit(req, res) {
  try {
    const event = await findEventById(req.params.id);
    if (!event) {
      setFlash(req, 'error', 'Event not found.');
      return res.redirect('/events');
    }
    return res.render('events/edit', {
      user: req.session.user,
      statuses: EVENT_STATUSES,
      event,
      error: res.locals.flashError,
    });
  } catch (err) {
    console.error('Failed to load event:', err);
    setFlash(req, 'error', 'Unable to load event.');
    return res.redirect('/events');
  }
}

async function update(req, res) {
  const { id } = req.params;
  const { title, location, start_date, end_date, description, event_url, status } = req.body;
  const uploadedImagePaths = (req.files || []).map((file) => file.filename);

  if (!title || !title.trim()) {
    const event = await findEventById(id).catch(() => ({ id, ...req.body }));
    return res.render('events/edit', {
      user: req.session.user,
      statuses: EVENT_STATUSES,
      event: event || { id, ...req.body },
      error: 'Event title is required.',
    });
  }

  if (!EVENT_STATUSES.includes(status)) {
    const event = await findEventById(id).catch(() => ({ id, ...req.body }));
    return res.render('events/edit', {
      user: req.session.user,
      statuses: EVENT_STATUSES,
      event: event || { id, ...req.body },
      error: 'Invalid status selected.',
    });
  }

  try {
    const currentEvent = await findEventById(id);
    if (!currentEvent) {
      setFlash(req, 'error', 'Event not found.');
      return res.redirect('/events');
    }

    const imagePathsToSave = uploadedImagePaths.length > 0
      ? uploadedImagePaths
      : (Array.isArray(currentEvent.event_image) ? currentEvent.event_image : []);

    await updateEventById(id, {
      title: title.trim(),
      location: location && location.trim() ? location.trim() : null,
      start_date: start_date || null,
      end_date: end_date || null,
      description: description && description.trim() ? description.trim() : null,
      event_image: imagePathsToSave,
      event_url: normalizeEventLink(event_url),
      status,
    });
    setFlash(req, 'success', 'Event updated successfully.');
    return res.redirect('/events');
  } catch (err) {
    console.error('Failed to update event:', err);
    setFlash(req, 'error', 'Update failed. Please try again.');
    return res.redirect(`/events/edit/${id}`);
  }
}

async function destroy(req, res) {
  try {
    await deleteEventById(req.params.id);
    setFlash(req, 'success', 'Event deleted successfully.');
    return res.redirect('/events');
  } catch (err) {
    console.error('Failed to delete event:', err);
    setFlash(req, 'error', 'Failed to delete event. Please try again.');
    return res.redirect('/events');
  }
}

module.exports = {
  index,
  add,
  store,
  edit,
  update,
  destroy,
};
