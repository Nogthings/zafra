import { siGithub, siX, type SimpleIcon } from "simple-icons"

type IconProps = {
    icon: SimpleIcon
    className?: string
    size?: number
}

const Icon = ({ icon, className, size = 24 }: IconProps) => {
    return (
        <svg
            role="img"
            viewBox="0 0 24 24"
            className={className}
            width={size}
            height={size}
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d={icon.path} />
        </svg>
    )
}

export const Icons = {
    gitHub: (props: Omit<IconProps, "icon">) => <Icon icon={siGithub} {...props} />,
    twitter: (props: Omit<IconProps, "icon">) => <Icon icon={siX} {...props} />,
}
