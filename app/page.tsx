import JobTextGenerator from './JobTextGenerator';

export default function Home() {
  const jobTitle = 'Software Engineer';
  return (
    <div>
      <h1 className="text-center text-2xl font-bold">Job Text Generator</h1>
      <JobTextGenerator jobTitle={jobTitle} regenerate={false} />
      <h1 className="text-center text-2xl font-bold mt-20">
        Job Text Re-Generator
      </h1>
      <JobTextGenerator jobTitle={jobTitle} regenerate={true} />
    </div>
  );
}
