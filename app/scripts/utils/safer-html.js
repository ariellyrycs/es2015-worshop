function saferHTML(literalSections, ...substs) {
  let raw = literalSections.raw;
  let result = '';
  substs.forEach((subst, i) => {
    let lit = raw[i];
    if (Array.isArray(subst)) {
      subst = subst.join('');
    }
    if (lit.endsWith('$')) {
      subst = htmlEscape(subst);
      lit = lit.slice(0, -1);
    }
    result += lit;
    result += subst;
  });
  result += raw[raw.length-1];
  return result;
}

function htmlEscape(str) {
  return str.replace(/&/g, '&amp;') // first!
  .replace(/>/g, '&gt;')//
  .replace(/</g, '&lt;')//
  .replace(/"/g, '&quot;')//
  .replace(/'/g, '&#39;')//
  .replace(/`/g, '&#96;');
}
export default saferHTML;
