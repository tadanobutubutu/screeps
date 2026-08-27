import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCharacterById } from '../api/characters';
import CharacterDetail from '../components/CharacterDetail';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function CharacterProfile() {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['character', id],
    queryFn: () => getCharacterById(id),
  });

  if (isLoading) {
    return (
      <main>
        <LoadingSpinner />
      </main>
    );
  }

  if (isError) {
    return (
      <section>
        <ErrorMessage message={error.message} />
      </section>
    );
  }

  return (
    <main>
      <CharacterDetail character={data} />
    </main>
  );
}