export default function downloadCSV(name:string,content:string) {
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURI(content);
  a.target = '_blank';
  a.download = name + '.csv';
  a.click();
}