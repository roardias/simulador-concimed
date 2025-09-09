import React, { useState } from 'react';
import './App.css';

function App() {
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [expandedScenario, setExpandedScenario] = useState(null);

  const salaryOptions = [
    { value: 10000, label: 'R$ 10.000,00' },
    { value: 20000, label: 'R$ 20.000,00' },
    { value: 30000, label: 'R$ 30.000,00' },
    { value: 40000, label: 'R$ 40.000,00' },
    { value: 50000, label: 'R$ 50.000,00' },
    { value: 60000, label: 'R$ 60.000,00' }
  ];

  const handleSalarySelect = (salary) => {
    setSelectedSalary(salary);
    setExpandedScenario(null); // Reset expanded state when changing salary
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const calculateScenarios = (grossSalary) => {
    if (!grossSalary) return [];

    const scenarios = [
      {
        name: 'Pessoa Física',
        type: 'pf',
        color: '#dc3545',
        taxRate: 0.275,
        costs: {
          imposto: grossSalary * 0.275,
          contador: 0,
          inssProLabore: 0,
          crmPj: 0,
          certificadoDigital: 0,
          tarifaBancaria: 0,
          txAdmConcimed: 0
        }
      },
      {
        name: 'Simples Nacional',
        type: 'simples',
        color: '#28a745',
        taxRate: 0.155,
        costs: {
          imposto: grossSalary * 0.155,
          contador: 800,
          inssProLabore: 166.98,
          crmPj: 179,
          certificadoDigital: 13.75,
          tarifaBancaria: 35,
          txAdmConcimed: 0
        }
      },
      {
        name: 'Lucro Presumido',
        type: 'presumido',
        color: '#17a2b8',
        taxRate: 0.1333,
        costs: {
          imposto: grossSalary * 0.1333,
          contador: 800,
          inssProLabore: 470.58,
          crmPj: 179,
          certificadoDigital: 13.75,
          tarifaBancaria: 35,
          txAdmConcimed: 0
        }
      },
      {
        name: 'Concimed',
        type: 'concimed',
        color: '#E0652C',
        taxRate: 0.0815,
        costs: {
          imposto: grossSalary * 0.0815,
          contador: 0,
          inssProLabore: 0,
          crmPj: 0,
          certificadoDigital: 0,
          tarifaBancaria: 0,
          txAdmConcimed: grossSalary * 0.0685
        }
      }
    ];

    return scenarios.map(scenario => {
      const totalCosts = Object.values(scenario.costs).reduce((sum, cost) => sum + cost, 0);
      const netValue = grossSalary - totalCosts;
      
      return {
        ...scenario,
        totalCosts,
        netValue,
        annualCosts: totalCosts * 12,
        annualNet: netValue * 12
      };
    });
  };

  const getBestScenario = (scenarios) => {
    return scenarios.reduce((best, current) => 
      current.netValue > best.netValue ? current : best
    );
  };

  const getBestNonConcimed = (scenarios) => {
    const nonConcimed = scenarios.filter(s => s.type !== 'concimed');
    return nonConcimed.reduce((best, current) => 
      current.netValue > best.netValue ? current : best
    );
  };

  const getConcimed = (scenarios) => {
    return scenarios.find(s => s.type === 'concimed');
  };

  const toggleExpanded = (scenarioType) => {
    setExpandedScenario(expandedScenario === scenarioType ? null : scenarioType);
  };

  return (
    <div className="App">
      {/* Header com logo e título */}
      <header className="header">
        <img 
          src="/logo_Concimed.svg" 
          alt="Logo Concimed" 
          className="logo"
        />
        <h1 className="title">Simulador Concimed</h1>
        <p className="subtitle">Compare sua remuneração médica</p>
      </header>

      {/* Container principal */}
      <main className="main-container">
        <h2 className="section-title">
          Qual sua remuneração média mensal?
        </h2>
        
        {/* Grid de botões de seleção */}
        <div className="salary-grid">
          {salaryOptions.map((option) => (
            <button
              key={option.value}
              className={`salary-button ${
                selectedSalary?.value === option.value ? 'selected' : ''
              }`}
              onClick={() => handleSalarySelect(option)}
            >
              {option.label}
            </button>
          ))}
        </div>

      </main>

      {/* Tabela de Comparação */}
      {selectedSalary && (
        <div className="comparison-container">
          <h2 className="comparison-title">Comparação de Cenários Fiscais</h2>
          
          {(() => {
            const scenarios = calculateScenarios(selectedSalary.value);
            const bestNonConcimed = getBestNonConcimed(scenarios);
            const concimed = getConcimed(scenarios);
            const savings = concimed.netValue - bestNonConcimed.netValue;

            return (
              <>
                <div className="comparison-table-wrapper">
                  <table className="comparison-table">
                    <thead>
                      <tr>
                        <th className="scenario-header-cell">Cenário</th>
                        {scenarios.map((scenario) => (
                          <th key={scenario.type} className="scenario-column" style={{ borderTopColor: scenario.color }}>
                            <div className="scenario-name" style={{ color: scenario.color }}>
                              {scenario.name}
                            </div>
                            <div className="tax-rate">
                              {(scenario.taxRate * 100).toFixed(2)}%
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="costs-row">
                        <td className="label-cell">
                          <div className="label-with-expand">
                            <span>Custos</span>
                            <button 
                              className="expand-toggle"
                              onClick={() => toggleExpanded('costs')}
                              title="Ver detalhes dos custos"
                            >
                              {expandedScenario === 'costs' ? '−' : '+'}
                            </button>
                          </div>
                        </td>
                        {scenarios.map((scenario) => (
                          <td key={scenario.type} className="value-cell cost-value">
                            {formatCurrency(scenario.totalCosts)}
                          </td>
                        ))}
                      </tr>

                      {expandedScenario === 'costs' && (
                        <>
                          <tr className="detail-row">
                            <td className="detail-label">Impostos</td>
                            {scenarios.map((scenario) => (
                              <td key={scenario.type} className="detail-value">
                                {formatCurrency(scenario.costs.imposto)}
                              </td>
                            ))}
                          </tr>
                          <tr className="detail-row">
                            <td className="detail-label">Contador</td>
                            {scenarios.map((scenario) => (
                              <td key={scenario.type} className="detail-value">
                                {formatCurrency(scenario.costs.contador)}
                              </td>
                            ))}
                          </tr>
                          <tr className="detail-row">
                            <td className="detail-label">INSS Pro-Labore</td>
                            {scenarios.map((scenario) => (
                              <td key={scenario.type} className="detail-value">
                                {formatCurrency(scenario.costs.inssProLabore)}
                              </td>
                            ))}
                          </tr>
                          <tr className="detail-row">
                            <td className="detail-label">CRM PJ</td>
                            {scenarios.map((scenario) => (
                              <td key={scenario.type} className="detail-value">
                                {formatCurrency(scenario.costs.crmPj)}
                              </td>
                            ))}
                          </tr>
                          <tr className="detail-row">
                            <td className="detail-label">Certificado Digital</td>
                            {scenarios.map((scenario) => (
                              <td key={scenario.type} className="detail-value">
                                {formatCurrency(scenario.costs.certificadoDigital)}
                              </td>
                            ))}
                          </tr>
                          <tr className="detail-row">
                            <td className="detail-label">Tarifa Bancária PJ</td>
                            {scenarios.map((scenario) => (
                              <td key={scenario.type} className="detail-value">
                                {formatCurrency(scenario.costs.tarifaBancaria)}
                              </td>
                            ))}
                          </tr>
                          <tr className="detail-row concimed-fee-row">
                            <td className="detail-label concimed-fee-label">Tx Adm Concimed (6,85%)</td>
                            {scenarios.map((scenario) => (
                              <td key={scenario.type} className={`detail-value ${scenario.type === 'concimed' ? 'concimed-fee-value' : ''}`}>
                                {formatCurrency(scenario.costs.txAdmConcimed)}
                              </td>
                            ))}
                          </tr>
                        </>
                      )}

                      <tr className="liquid-row">
                        <td className="label-cell highlight-label">Líquido Mensal</td>
                        {scenarios.map((scenario) => (
                          <td key={scenario.type} className="value-cell liquid-value" style={{ color: scenario.color }}>
                            <strong>{formatCurrency(scenario.netValue)}</strong>
                          </td>
                        ))}
                      </tr>

                      <tr className="annual-costs-row">
                        <td className="label-cell">Custos Anuais</td>
                        {scenarios.map((scenario) => (
                          <td key={scenario.type} className="value-cell annual-value">
                            {formatCurrency(scenario.annualCosts)}
                          </td>
                        ))}
                      </tr>

                      <tr className="annual-liquid-row">
                        <td className="label-cell highlight-label">Líquido Anual</td>
                        {scenarios.map((scenario) => (
                          <td key={scenario.type} className="value-cell liquid-value" style={{ color: scenario.color }}>
                            <strong>{formatCurrency(scenario.annualNet)}</strong>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Análise de Economia */}
                <div className="savings-analysis">
                  <h3>💰 Análise de Economia</h3>
                  {savings > 0 ? (
                    <div className="savings-content">
                      <p>
                        <strong>Com a Concimed você estará economizando ao ano:</strong>
                      </p>
                      <div className="savings-amount">
                        {formatCurrency(savings * 12)}
                      </div>
                      <p className="savings-note">
                        Comparado com o melhor cenário alternativo ({bestNonConcimed.name})
                      </p>
                      <div className="savings-breakdown">
                        <div className="monthly-savings">
                          <span>Economia mensal: {formatCurrency(savings)}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="savings-content">
                      <p>
                        <strong>O cenário {bestNonConcimed.name} oferece maior retorno líquido:</strong>
                      </p>
                      <div className="savings-amount negative">
                        {formatCurrency(Math.abs(savings) * 12)} a mais por ano
                      </div>
                      <p className="savings-note">
                        A Concimed pode não ser a melhor opção para esta faixa salarial
                      </p>
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}

export default App;
