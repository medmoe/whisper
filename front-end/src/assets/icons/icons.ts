import building from './building.png'
import movie from './movie.png'
import music from './music.png'
import travel from './travel.png'
import food from './food.png'
import water from './water_drop.png'

interface Category{
    name: string;
    url: string;
}
export const categories: Category[] = [
    {name: 'buildings', url: building},
    {name: 'movie', url: movie},
    {name: 'music', url: music},
    {name: 'travel', url: travel},
    {name: 'food', url: food},
    {name: 'water', url: water},
]