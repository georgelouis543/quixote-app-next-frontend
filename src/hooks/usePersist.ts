'use client'

import { useState, useEffect } from "react"

const usePersist = (): [boolean, React.Dispatch<React.SetStateAction<boolean>>] => {
  const [persist, setPersist] = useState<boolean>(false)
  // adding loaded state for type-safety (as using undefined causes setPersist to throw type warning)
  const [loaded, setLoaded] = useState(false) 

  useEffect(() => {
    const stored = localStorage.getItem("persist")
    if (stored !== null) {
      setPersist(JSON.parse(stored))
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("persist", JSON.stringify(persist))
    }
  }, [persist, loaded])


  return [loaded ? persist : false, setPersist]
}  

export default usePersist