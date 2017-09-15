import React from 'react';
import Section from 'grommet/components/Section';
import Card from 'grommet/components/Card';
import Heading from 'grommet/components/Heading';
import Box from 'grommet/components/Box';
import Paragraph from 'grommet/components/Paragraph';
import Label from 'grommet/components/Label';
import Button from 'grommet/components/Button';
import Spinning from 'grommet/components/icons/Spinning';
import Info from 'grommet/components/icons/base/Info';
import Anchor from 'grommet/components/Anchor';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import TextInput from 'grommet/components/TextInput';
import AddIcon from 'grommet/components/icons/base/Add';
import Tabs from 'grommet/components/Tabs';
import Tab from 'grommet/components/Tab';
import Layer from '../Layer';
import ViewObjetivoLayerContent from './ViewObjetivoLayerContent';
import AddObjetivoLayerContent from './AddObjetivoLayerContent';
import Objetivos from './Objetivos';
import Pags from '../Pags';
import TipBubble from '../TipBubble';
import AnnotatedMeter from '../AnnotatedMeter';
import BadgeLayer from '../BadgeLayer';
import acessorio00 from '../../assets/acessorio00.png';
import acessorio01 from '../../assets/acessorio01.png';
import acessorio02 from '../../assets/acessorio02.png';
import acessorio03 from '../../assets/acessorio03.png';
import acessorio04 from '../../assets/acessorio04.png';
import acessorio05 from '../../assets/acessorio05.png';
import acessorio06 from '../../assets/acessorio06.png';
import acessorio07 from '../../assets/acessorio07.png';
import acessorio08 from '../../assets/acessorio08.png';
import acessorio09 from '../../assets/acessorio09.png';
import acessorio10 from '../../assets/acessorio10.png';
import AulasList from './AulasList';
import Dica from './Dica';


const acessoriosSrc = {
  [0]: acessorio00,
  [1]: acessorio01,
  [2]: acessorio02,
  [3]: acessorio03,
  [4]: acessorio04,
  [5]: acessorio05,
  [6]: acessorio06,
  [7]: acessorio07,
  [8]: acessorio08,
  [9]: acessorio09,
  [10]: acessorio10
}

export default class MainScreen extends React.Component {
  state = {
    hasInvestidorInfo: false
  };

  componentWillReceiveProps(nextProps) {
    if(nextProps.investidorInfo || this.props.investidorInfo) {
      this.setState({
        hasInvestidorInfo: true
      })
    }
  }

  componentDidMount() {
    if (!this.props.pagsAcessorios[0].isConquered) {
      this.props.conquerAcessorio(0, 'completou o cadastro');
    }
    if(!this.props.investidorInfo) {
      this.props.fetchInvestidorInfo();
    } else {
      this.setState({
        hasInvestidorInfo: true
      })
    }
  }

  onSelectObjetivo = (selection) => {
    this.setState({selection});
  }
  onDeselectObjetivo = () => {
    this.setState({selection: undefined, addObj: undefined});
  }
  onClickAddObjetivo = () => {
    this.setState({addObj: true});
    this.props.setActionComplete('addObjetivo');
  }

  toggleDica = (value) => {
    this.setState({
      dica: value
    })
  }

  renderTabs = (InvestimentosBox, ObjetivosBox, DicasPagsBox, EducacionalBox) => {
    return (
      <Tabs responsive={false}>
        <Tab title='Investimentos'>
          {DicasPagsBox}
          {InvestimentosBox}
        </Tab>
        <Tab title='Projeções'>
        </Tab>
        <Tab title='Metas'>
          {ObjetivosBox}
        </Tab>
        <Tab title='Agenda'>
          {EducacionalBox}
        </Tab>
      </Tabs>
    )
  }

  render() {
    const {small, addObjetivo, editObjetivo, removeObjetivo, pagsAcessorios, rawObjetivos, orderObjetivos, novaRecompensa, conquerAcessorio, eraseNovaRecompensa} = this.props;
    const {selection, addObj, hasInvestidorInfo} = this.state;

    const active = pagsAcessorios ? pagsAcessorios.filter(acessorio => acessorio.selected) : null;
    let activeAcessorio;
    if (active && active[0] !== undefined) {
      activeAcessorio = active[0].id;
    }

    let investidorInfo;
    let investimentos;
    let investimentosData = [];
    let total;
    if (this.props.investidorInfo && hasInvestidorInfo) {
      investidorInfo = this.props.investidorInfo;
      total = investidorInfo.posicao_consolidada.saldo_total_investido;
      investimentos = investidorInfo.posicao_consolidada.investimentos;
      investimentosData = investimentos.map((investimento, index) => {
        return (
          {
            label: investimento.nome,
            value: investimento.saldo,
            colorIndex: `graph-${index+1}`,
            onClick: () => this.props.seeMoreMeuInvestimento(investimento.codigo)
          }
        );
      })
    }

    const objetivos = rawObjetivos.map(objetivo => {
      if(total >= objetivo.valor) {
        total-= objetivo.valor;
        objetivo.acumulado = 1;
      }
      else {
        objetivo.acumulado = total/objetivo.valor;
        total=0;
      }
      return objetivo;
    })

    let layer;

    if (selection >= 0) {
      layer = (
        <Layer
          onClose={this.onDeselectObjetivo}
          a11yTitle='Detalhes do objetivo'
        >
          <ViewObjetivoLayerContent objetivo={objetivos[selection]} small={small} editObjetivo={editObjetivo} removeObjetivo={removeObjetivo} />
        </Layer>
      )
    } else if (addObj) {
      layer = (
        <Layer
          onClose={this.onDeselectObjetivo}
          a11yTitle='Adicionar objetivo'
        >
          <AddObjetivoLayerContent small={small} addObjetivo={addObjetivo} conquerAcessorio={conquerAcessorio} pagsAcessorios={pagsAcessorios}/>
        </Layer>
      )
    } else if (novaRecompensa.active) {
      layer = (
        <BadgeLayer
          onClose={eraseNovaRecompensa}
          recompensa={novaRecompensa}
          small={small}
        />
      )
    }
    const DicasPagsBox =
    <Box style={{backgroundColor: 'white', width: small ? '' : '35%'}}
      margin={small ? 'medium' : {left: 'medium', right: 'small'}}
      direction={small ? 'row' : 'column'}
      align='center'
      justify='center'
      pad={{between: 'small'}}
      responsive={false} >
      {!small &&
        <TipBubble
          style={{maxWidth: '292px'}}
          small={small}
          caret >
            <Box pad={{between: 'medium'}}>
              <Paragraph size='large' margin='none'>Eaí, beleza? Você já ganhou R$5,00</Paragraph>
              <Paragraph size='large' margin='none'>
                Não é ótimo
                ganhar um
                dinheirinho só
                investindo?
              </Paragraph>
            </Box>
        </TipBubble>
      }
      <Pags size={small ? 'small' : 'medium'} src={acessoriosSrc[activeAcessorio]} />
      {small &&
        <TipBubble
          style={{maxWidth: '292px'}}
          small={small} >
            <Box pad={small ? {between: 'large'} : {between: 'medium'}}>
              <Paragraph size='large' margin='none'>Eaí, beleza? Você já ganhou R$5,00</Paragraph>
              <Paragraph size='large' margin='none'>
                Não é ótimo
                ganhar um
                dinheirinho só
                investindo?
              </Paragraph>
            </Box>
        </TipBubble>
      }
    </Box>;

    const ObjetivosBox = <Box style={{backgroundColor: 'white', width: small ? '' : '65%'}}  margin={small ? 'medium' : {left: 'small', right: 'medium'}}>
      <Card
        style={{width:'100%'}}
        heading={
          <div style={{display: 'flex'}}>
            <Box margin={{bottom: 'small'}}>
              <Heading tag='h2' margin='none'>
                Seus Objetivos
              </Heading>
              <Label size='small'>Ordene seus objetivos, defina prioridades</Label>
            </Box>

              {
                this.props.activeUser.dica ?
                <Box>
                    <Anchor icon={<Info />} onClick={() => this.toggleDica(this.props.activeUser.dica)} />
                </Box>
                :
                null
              }

            <Box flex="grow" align="end">
              <Button onClick={this.onClickAddObjetivo}  icon={<AddIcon />} />
            </Box>

          </div>
          }
      >
        <Objetivos onSelectObjetivo={this.onSelectObjetivo} small={small} onSortEnd={orderObjetivos} objetivos={objetivos} />
      </Card>
    </Box>;

    const InvestimentosBox = <Box direction='row'  style={{backgroundColor: 'white', width: small ? '' : '65%'}} margin={small ? 'medium' : {top: 'medium', left: 'medium', right: 'small'}}>
      <Card
        style={{width:'100%'}}
        heading={
            <Heading tag='h2'>
              Seus Investimentos
            </Heading>
          }
      >
        <Box align='center'>
          <AnnotatedMeter type="circle" legend={true} units="R$"
            size={small ? 'medium' : 'medium'}  series={investimentosData} />
          <Box pad={{vertical: 'large', horizontal: 'medium', between: 'medium'}}>
            <FormField size='medium'>
              <TextInput placeHolder="Valor do resgate"></TextInput>
            </FormField>
            <Button label='Resgatar' primary onClick={() => console.log('RESGATE FEITO')}/>
          </Box>
        </Box>
      </Card>
    </Box>;

    const EducacionalBox = <Box direction='row' align="center" style={{backgroundColor: 'white', width: small ? '' : '35%'}} margin={small ? 'medium' : {top: 'medium', left: 'small', right: 'medium'}}>
      <Card
        style={{width:"100%"}}
        heading={
            <Heading tag='h2'>
              Educacional
            </Heading>
          }
      >
        <AulasList />
      <Box>

      </Box>
      </Card>
    </Box>;

    const desktopView = [
      <Box direction='row'>
        {DicasPagsBox}
        {ObjetivosBox}
      </Box>,
      <Box direction='row'>
        {InvestimentosBox}
        {EducacionalBox}
      </Box>
    ];

    const mobileView = this.renderTabs(InvestimentosBox, ObjetivosBox, DicasPagsBox, EducacionalBox);


    return hasInvestidorInfo ?
    (
      <div>
        <Section>
          {
            this.state.dica && this.props.activeUser.dica ?
            <Dica seeMoreInvestimento={this.props.seeMoreInvestimento} onClose={() => this.toggleDica(false)} dica={this.props.activeUser.dica}  />
            :
            null
          }
          {small ? mobileView : desktopView}
        </Section>
        {layer}
      </div>
    ) : <Spinning style={{position: 'absolute', top:'50%', left: '50%'}} size='large' />
  }
}
