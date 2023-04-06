import './App.css'
import { useMovies } from './hooks/useMovies'
import { Movies } from './components/Movies.jsx'
import { useState, useEffect, useRef, useCallback } from 'react'
import debounce from 'just-debounce-it'

function useSearch () {
  const [search, updateSearch] = useState('')
  const [error, setError] = useState(null)
  const isFirstInput = useRef(true)

  useEffect(() => {
    if (isFirstInput.current) {
      isFirstInput.current = search === ''
      return
    }

    if (search === '') {
      setError('Impossible to search an empty movie')
      return
    }

    if (search.match(/^\d+$/)) {
      setError('Impossible todo search a movie with numbers')
      return
    }

    if (search.length < 3) {
      setError('Impossible todo search a short movie title')
      return
    }

    setError(null)
  }, [search])

  return { search, updateSearch, error }
}

function App() {
  const [sort, setSort] = useState(false)

  const { search, updateSearch, error } = useSearch()
  const { movies, loading, getMovies } = useMovies({ search, sort })

  const debouncedGetMovies = useCallback(
    debounce(search => {
    console.log('search', search)
    getMovies({ search })
  }, 300)
  , [getMovies]
)

  const handleSubmit = (event) => {
    event.preventDefault()
    getMovies({search})
  }

  const handleSort = () => {
    setSort(!sort)
  }

  const handleChange = (event) => {
    const newSearch = event.target.value
    updateSearch(newSearch)
    debouncedGetMovies(newSearch)
  }

  return (
    <div className='page'>

      <header>
        <h1>Search bar movies</h1>
        <form className='form' onSubmit={handleSubmit}>
          <input
            style={{ border: '1px solid transparent', borderColor: error ? 'red' : 'transparent' }} onChange={handleChange}
            value={search}
            name='query'
            placeholder="Avenger, Star Wars, The Matrix..."
          />
          <input type="checkbox" onChange={handleSort} checked={sort}/>
          <button type='submit'>Search</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </header>

      <main>
        {
          loading ? <p>Loading...</p> : <Movies movies={movies} />
        }
      </main>

    </div>
  )
}

export default App
