export function summarizeCourse(course) {
  if (!course || typeof course.title !== 'string' || !course.title.trim()) {
    throw new TypeError('A non-empty course title is required.');
  }
  if (!Array.isArray(course.modules) || course.modules.some((module) =>
    !module || typeof module.name !== 'string' || !module.name.trim() ||
    typeof module.complete !== 'boolean')) {
    throw new TypeError('Modules need a name and a boolean complete value.');
  }
  const total = course.modules.length;
  const completed = course.modules.filter((module) => module.complete).length;
  return {
    title: course.title,
    total,
    completed,
    remaining: total - completed,
    percent: total === 0 ? 0 : Math.round(completed / total * 100),
  };
}

export function formatSummary(summary) {
  return `${summary.title}: ${summary.completed}/${summary.total} modules complete (${summary.percent}%).`;
}
