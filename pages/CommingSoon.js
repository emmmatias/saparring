import fs from 'fs';
import path from 'path';

export const getStaticProps = async () => {
  const filePath = path.join(process.cwd(), './components/coming-soon.html');
  const html = fs.readFileSync(filePath, 'utf8');

  return {
    props: {
      html,
    },
  };
};

function MiPagina({ html }) {
  return (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  );
}

export default MiPagina;