const table = document.getElementById('table');
const tableBody = table.getElementsByTagName('tbody')[0];

table.addEventListener('click', (event) => {
  const { target } = event;

  if (target instanceof HTMLElement && target.nodeName === 'TD') {
    target.textContent = '*';
  }
});

table.addEventListener('contextmenu', (event) => {
  event.preventDefault();

  const { target } = event;

  if (target instanceof HTMLElement && target.nodeName === 'TD') {
    target.textContent = '';
  }
});

let hoveredElement;

table.addEventListener('mouseover', (event) => {
  const { target } = event;

  if (target instanceof HTMLElement && target.nodeName === 'TD') {
    hoveredElement = target;
  }
});

table.addEventListener('mouseout', (event) => {
  const { target } = event;

  if (hoveredElement === target) {
    hoveredElement = undefined;
  }
});

let columnCount = table.getElementsByTagName('tr')[0].childElementCount;

document.addEventListener('keydown', (event) => {
  const { key } = event;

  switch (event.code) {
    case 'ArrowDown': {
      const row = document.createElement('tr');
      const columns = Array(columnCount)
        .fill()
        .map(() => document.createElement('td'));

      row.append(...columns);
      tableBody.appendChild(row);
      break;
    }

    case 'ArrowUp': {
      const rows = table.getElementsByTagName('tr');

      tableBody.removeChild(rows[rows.length - 1]);
      break;
    }

    case 'ArrowLeft': {
      const rows = table.getElementsByTagName('tr');

      Array.from(rows).forEach((row) => {
        const cells = row.getElementsByTagName('td');

        row.removeChild(cells[cells.length - 1]);
      });

      columnCount--;
      break;
    }

    case 'ArrowRight': {
      const rows = table.getElementsByTagName('tr');

      Array.from(rows).forEach((row) => {
        row.appendChild(document.createElement('td'));
      });

      columnCount++;
      break;
    }

    default: {
      if (
        hoveredElement &&
        (key === ' ' ||
          (!Number.isNaN(parseInt(key, 10)) && !'01'.includes(key)))
      ) {
        hoveredElement.textContent = key === ' ' ? '' : key;
      }
    }
  }
});

document.getElementById('copy').addEventListener('click', () => {
  const rows = Array.from(table.getElementsByTagName('tr')).map((row) => {
    const cells = Array.from(row.getElementsByTagName('td'));

    return cells.map((cell) => cell.textContent || '.').join('');
  });

  navigator.clipboard.writeText(rows.join('\n'));
});
