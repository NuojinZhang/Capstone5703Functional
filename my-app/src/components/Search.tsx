import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch-dom';

const searchClient = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!, process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!);

interface FileHit {
  filename: string;
  filepath: string;
}

const Hit = ({ hit }: { hit: FileHit }) => (
  <div>
    <p>{hit.filename}</p>
    <a href={hit.filepath} target="_blank" rel="noopener noreferrer">Download</a>
  </div>
);

const Search: React.FC = () => {
  return (
    <InstantSearch searchClient={searchClient} indexName="files">
      <SearchBox />
      <Hits hitComponent={Hit} />
    </InstantSearch>
  );
};

export default Search;
