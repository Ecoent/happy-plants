import React from 'react'
import styled from 'styled-components'
import { createTeleporter } from 'react-teleporter'
import { Link, useHistory } from 'react-router-dom'
import { ArrowLeft } from 'react-feather'
import { theme, ThemeColors } from 'theme'
import { routePaths } from 'routes'
import { Heading } from './Typography'
import VisuallyHidden from './VisuallyHidden'
import AppLogo from './AppLogo'

export const AppHeaderPortal = createTeleporter()

const AppHeaderContainer = styled.header<{ backgroundColor?: AppHeaderColor }>`
  width: 100%;
  height: ${(props) => props.theme.frameWidgetHeight};
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: ${(props) =>
    props.backgroundColor === undefined
      ? 'transparent'
      : props.theme.colors[props.backgroundColor]};

  & > div:not(:first-of-type) {
    display: grid;
    align-items: center;
    height: 100%;
    grid-template-columns: auto auto;
    margin-left: auto;
  }
`

const AppHeaderIcon = styled.div`
  height: 100%;
  min-width: ${(props) => props.theme.frameWidgetHeight};
  display: flex;
  justify-content: center;
  align-items: center;

  & > a,
  & > button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    border: none;
    background: transparent;

    &:focus {
      outline: none;
      background: ${(props) => props.theme.colors.white};
      border-bottom-right-radius: ${(props) => props.theme.baseRadius};
    }
  }
`

export const AppHeaderButton = styled.button`
  background: ${({ theme }) => theme.colors.beige};
  border: none;
  cursor: pointer;
  min-width: ${(props) => props.theme.frameWidgetHeight};
  height: 100%;
  position: relative;

  &:focus {
    outline: none;
    background: ${(props) => props.theme.colors.green};

    svg {
      stroke: ${(props) => props.theme.colors.white};
    }
  }
`

export type AppHeaderColor = 'green' | 'blue' | 'beige'

export type AppHeaderProps = React.PropsWithChildren<{
  color?: AppHeaderColor
}>

const textColorMap: Record<AppHeaderColor, Partial<ThemeColors>> = {
  beige: 'greenDark',
  blue: 'white',
  green: 'white',
}

export default function AppHeader(props: AppHeaderProps) {
  const { color, children } = props
  const history = useHistory()
  const textColor = (color && textColorMap[color]) || 'greenDark'
  const hasRouteTitle = React.Children.count(children) > 0
  const showBackButton = history.location.pathname.split('/').filter(Boolean).length > 1

  return (
    <AppHeaderContainer backgroundColor={color} role="banner">
      <AppHeaderIcon>
        {showBackButton ? (
          <button
            onClick={() =>
              history.location.pathname === routePaths.login
                ? history.push(routePaths.root)
                : history.goBack()
            }
            data-cy="app-header-return"
          >
            <ArrowLeft color={theme.colors[textColor]} aria-hidden="true" focusable="false" />
            <VisuallyHidden>Back</VisuallyHidden>
          </button>
        ) : (
          <Link to={routePaths.root}>
            <AppLogo color={textColor} inverse={textColor !== 'greenDark'} />
            <VisuallyHidden>HappyPlants</VisuallyHidden>
          </Link>
        )}
      </AppHeaderIcon>

      <Heading color={textColor} as="h1" bold>
        {hasRouteTitle ? children : 'HappyPlants'}
      </Heading>

      <AppHeaderPortal.Target />
    </AppHeaderContainer>
  )
}
