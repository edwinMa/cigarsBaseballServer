// uniform.js - build the uniform-combination line for game notifications.
// Central source of truth so every game-related message formats it the same way.

// Returns a one-line uniform string, or '' when no combination has been chosen.
// Only the pieces that are set are included (a partial combo still shows).
function uniformLine(game) {
  if (!game) return '';
  const parts = [];
  if (game.uniform_cap) parts.push(`${game.uniform_cap} cap`);
  if (game.uniform_shirt) parts.push(`${game.uniform_shirt} top`);
  if (game.uniform_pants) parts.push(`${game.uniform_pants} pants`);
  if (parts.length === 0) return '';
  return `Uniform: ${parts.join(', ')}.`;
}

// Appends the uniform line to a message, unless the message already mentions a
// uniform (so a hand-written message that already states it isn't duplicated) or
// no combination is set.
function appendUniform(message, game) {
  const line = uniformLine(game);
  if (!line) return message;
  if (/uniform/i.test(message)) return message;
  return `${message}\n\n${line}`;
}

module.exports = { uniformLine, appendUniform };
