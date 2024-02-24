import './index.css'

const Skills = props => {
  const {SkillsData} = props
  const {imageUrl, name} = SkillsData

  return (
    <li className="skill-items">
      <img src={imageUrl} alt={name} />
      <p className="skill-name">{name}</p>
    </li>
  )
}

export default Skills
